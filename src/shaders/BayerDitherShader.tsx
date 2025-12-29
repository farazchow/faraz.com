import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { type IUniform } from "three";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class BayerDitherShader extends Shader {
    postLighting: boolean = true;
    fragmentShader: string = `
        varying vec2 vUv;
        uniform float u_matrixSize;
        uniform float u_bias;
        uniform float u_useColor;
        uniform float u_grayScale;
        uniform vec3 u_color;

        const mat2x2 bayerMatrix2x2 = mat2x2(
            0.0, 2.0,
            3.0, 1.0
        ) / 4.0;

        const mat4x4 bayerMatrix4x4 = mat4x4(
            0.0,  8.0,  2.0, 10.0,
            12.0, 4.0,  14.0, 6.0,
            3.0,  11.0, 1.0, 9.0,
            15.0, 7.0,  13.0, 5.0
        ) / 16.0;

        const float bayerMatrix8x8[64] = float[64](
            0.0/ 64.0, 48.0/ 64.0, 12.0/ 64.0, 60.0/ 64.0,  3.0/ 64.0, 51.0/ 64.0, 15.0/ 64.0, 63.0/ 64.0,
        32.0/ 64.0, 16.0/ 64.0, 44.0/ 64.0, 28.0/ 64.0, 35.0/ 64.0, 19.0/ 64.0, 47.0/ 64.0, 31.0/ 64.0,
            8.0/ 64.0, 56.0/ 64.0,  4.0/ 64.0, 52.0/ 64.0, 11.0/ 64.0, 59.0/ 64.0,  7.0/ 64.0, 55.0/ 64.0,
        40.0/ 64.0, 24.0/ 64.0, 36.0/ 64.0, 20.0/ 64.0, 43.0/ 64.0, 27.0/ 64.0, 39.0/ 64.0, 23.0/ 64.0,
            2.0/ 64.0, 50.0/ 64.0, 14.0/ 64.0, 62.0/ 64.0,  1.0/ 64.0, 49.0/ 64.0, 13.0/ 64.0, 61.0/ 64.0,
        34.0/ 64.0, 18.0/ 64.0, 46.0/ 64.0, 30.0/ 64.0, 33.0/ 64.0, 17.0/ 64.0, 45.0/ 64.0, 29.0/ 64.0,
        10.0/ 64.0, 58.0/ 64.0,  6.0/ 64.0, 54.0/ 64.0,  9.0/ 64.0, 57.0/ 64.0,  5.0/ 64.0, 53.0/ 64.0,
        42.0/ 64.0, 26.0/ 64.0, 38.0/ 64.0, 22.0/ 64.0, 41.0/ 64.0, 25.0/ 64.0, 37.0/ 64.0, 21.0 / 64.0
        );

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
    cacheKey?: () => string;

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