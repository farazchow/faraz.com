import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { type IUniform } from "three";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class WhiteDitherShader extends Shader {
    postLighting: boolean = true;
    fragmentShader: string = `
        varying vec2 vUv;
        uniform float u_useColor;
        uniform vec3 u_color;

        float random(vec2 c) {
            return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        vec3 whiteNoiseDither(vec3 c, float lum, vec2 screenPos) {
            vec3 color = c;

            if (lum < random(screenPos)) {
                color = vec3(0.0);
            } else {
                color = c; 
            }
            
            return color;
        }
    `;
    postLightingCode: string = `
        vec3 color = gl_FragColor.rgb;
        float lum = dot(vec3(0.2126, 0.7152, 0.0722), color);
        if (u_useColor == 1.0) {
            color = u_color;
        }
        gl_FragColor = vec4(whiteNoiseDither(color, lum, gl_FragCoord.xy), 1.0);
    `;
    uniforms: Record<string, IUniform>;

    constructor(color?: THREE.Color) {
        super();

        this.uniforms = {
            u_time: {value: 0.0},
            u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            u_useColor: {value: color ? 1.0 : 0.0},
            u_color: {value: (color ?? new THREE.Vector3(0.0, 0.0, 0.0))}
        };
    }

    UpdateUniforms(material: CustomShaderMaterial, state: RootState) {
        material.uniforms.u_time.value = state.clock.getElapsedTime();
    }
}