import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import type { SchemaToValues, Schema } from "leva/dist/declarations/src/types";
import { oceanVertexGLSL } from "../utils/OceanSimulation";
import { Ocean } from "../utils/OceanSimulation";

export default class OceanShader extends Shader {
    vertexShader: string = oceanVertexGLSL;
    fragmentShader: string = `
            varying vec2 vUv;
            varying float vHeightDelta;

            uniform float u_time;
            uniform vec3 u_color1;
            uniform vec3 u_color2;
            uniform float u_density;
            uniform float u_dotSize;
            uniform vec2 u_resolution;

            float getZShift(float f) {
                float colorShift = min(vHeightDelta, f);
                if (vHeightDelta < 0.0) {
                    colorShift = max(vHeightDelta, -1.0 * f);
                }

                return colorShift;
            }

            void main() {
                vec2 relativePos = mod(gl_FragCoord.xy, u_density);

                // Make the pixel invis if its not in the center dot
                if ((relativePos.x > (u_density / 2.0) + u_dotSize) || (relativePos.x < (u_density / 2.0) - u_dotSize)) {
                    csm_DiffuseColor.rgb = vec3(0.0);
                }
                else if ((relativePos.y > (u_density / 2.0) + u_dotSize) || (relativePos.y < (u_density / 2.0) - u_dotSize)) {
                    csm_DiffuseColor.rgb = vec3(0.0);
                }
                else {
                    csm_DiffuseColor.rgb = mix(u_color1, u_color2, vUv.x);
                }
            }
        `;
    uniforms: Record<string, THREE.Uniform>;
    ocean: Ocean;
    delta: number = 0;

    constructor(color1: THREE.Color, color2: THREE.Color, density: number = 5, dotSize: number = 1,) {
        super();

        this.ocean = new Ocean();
        this.uniforms = {
            // VertexShader variables
            u_time: new THREE.Uniform(0),
            u_waveCount: new THREE.Uniform(this.ocean.waveCount),
            u_gerstnerWaves: new THREE.Uniform(this.ocean.gerstnerWaves),
            u_steepness: new THREE.Uniform(this.ocean.steepness),
            
            // FragmentShader variables
            u_resolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
            u_color1: new THREE.Uniform(color1),
            u_color2: new THREE.Uniform(color2),
            u_density: new THREE.Uniform(density),
            u_dotSize: new THREE.Uniform(dotSize),
        };
    }

    UpdateUniforms(material: CustomShaderMaterial, state: RootState, options?: SchemaToValues<Schema>) {
        material.uniforms.u_time.value = state.clock.getElapsedTime();

        if (options) {
            material.uniforms.u_color1.value = new THREE.Color((options.u_color1 as string));
            material.uniforms.u_color2.value = new THREE.Color((options.u_color2 as string));
            material.uniforms.u_density.value = (options.u_density as number);
            material.uniforms.u_dotSize.value = (options.u_dotSize as number);
        }
    }

    getLevaControls(): SchemaToValues<Schema> {
        return {
            u_color1: {
                value: "#005b76",
            },
            u_color2: {
                value: "#030958",
            },
            u_density: {
                value: this.uniforms.u_density.value,
                min: 1,
                max: 50,
                step: 1
            },
            u_dotSize: {
                value: this.uniforms.u_dotSize.value,
                min: .5,
                max: 25,
                step: .5
            },
        }
    }
}