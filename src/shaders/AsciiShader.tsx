import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { type IUniform } from "three";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class AsciiShader extends Shader {
    postLighting: boolean = true;
    fragmentShader: string = `
        varying vec2 vUv;
        uniform float u_matrixSize;
        uniform float u_bias;
        uniform float u_useColor;
        uniform float u_grayScale;
        uniform vec3 u_color;

        // Ascii Colors
        // " .:-=+*#%@"

        vec3 orderedDither(float lum, vec3 lightColor) {
            vec3 color = lightColor;
            vec2 coord = gl_FragCoord.xy;

            float threshold = 0.0;

            if (u_matrixSize == 2.0) {
                int x = int(coord.x) % 2;
                int y = int(coord.y) % 2;
                threshold = bayerMatrix2x2[y][x];
            }

            if (u_matrixSize == 4.0) {
                int x = int(coord.x) % 4;
                int y = int(coord.y) % 4;
                threshold = bayerMatrix4x4[y][x];
            }

            if (u_matrixSize == 8.0) {
                int x = int(coord.x) % 8;
                int y = int(coord.y) % 8;
                threshold = bayerMatrix8x8[y * 8 + x];
            }

            if (lum < threshold + u_bias) {
                color = vec3(0.0);
            } else {
                color = lightColor; 
            }

            return color;
        }
    `;
    postLightingCode: string = `
        vec3 color = gl_FragColor.rgb;
        float lum = dot(vec3(0.2126, 0.7152, 0.0722), color);

        // Color Configs
        if (u_grayScale == 1.0) {
            color = vec3(lum);
        }
        if (u_useColor == 1.0) {
            color = u_color;
            if (u_grayScale == 1.0) {
                color = u_color * lum;
            }
        }

        gl_FragColor.rgb = orderedDither(lum, color);
    `;
    uniforms: Record<string, IUniform>;

    constructor(bias: number, grayScale: boolean = false, color?: THREE.Color) {
        super();
        if (bias > 1 && bias < 0) {
            throw new Error("Bias must be a float between 0 and 1 inclusive");
        }
        this.uniforms = {
            u_time: {value: 0.0},
            u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            u_bias: {value: bias},
            u_matrixSize: {value: 4.0},
            u_useColor: {value: color ? 1.0 : 0.0},
            u_color: {value: (color ?? new THREE.Vector3(0.0, 0.0, 0.0))},
            u_grayScale: {value: grayScale}
        };
    }

    UpdateUniforms(material: CustomShaderMaterial, state: RootState) {
        material.uniforms.u_time.value = state.clock.getElapsedTime();
    }
}