import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { type IUniform, Color } from "three";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class TestShader extends Shader {
    postLighting: boolean = true;
    vertexShader: string = `
            uniform float u_time;
            varying vec2 vUv;

            void main() {
                vUv = uv;
                // vec3 modelPosition = position;
                // modelPosition.z += sin(modelPosition.x * 4.0 + u_time * 2.0) * 0.2;
                // csm_Position = modelPosition;
            }
        `;
    fragmentShader: string = `
            varying vec2 vUv;
            uniform vec3 u_color;
            vec3 TestVector = vec3(.6, .4, .2);

            void main() {
                // csm_FragColor.rgb = mix(csm_DiffuseColor.rgb, u_color, vUv.x);
                // csm_FragColor.rgb = vec3((vUv.x + vUv.y)/2.0);
            }
    `;
    postLightingCode: string = `
        gl_FragColor.rgb = vec3(0.0, (vUv.x + vUv.y)/2.0, 0.0);
    `
    uniforms: Record<string, IUniform>;
    cacheKey?: () => string;

    constructor(color: Color) {
        super();
        this.uniforms = {
            u_time: {value: 0.0},
            u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            u_color: {value: color}
        };
    }

    UpdateUniforms(material: CustomShaderMaterial, state: RootState) {
        material.uniforms.u_time.value = state.clock.getElapsedTime();
    }
}