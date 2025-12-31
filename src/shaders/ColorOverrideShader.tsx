import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { Color, type IUniform } from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import type { SchemaToValues, Schema } from "leva/dist/declarations/src/types";

export default class ColorOverrideShader extends Shader {
    fragmentShader: string = `
            varying vec2 vUv;
            uniform vec3 u_color;

            void main() {
                csm_FragColor.rgb = u_color;
            }
    `;

    uniforms: Record<string, IUniform>;

    constructor(color: Color) {
        super();
        this.uniforms = {
            u_color: {value: color}
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UpdateUniforms(material: CustomShaderMaterial, state: RootState, options?: SchemaToValues<Schema>) {
        if (options) {
            material.uniforms.u_color.value = new Color((options.u_color as string));
        }
    }

    getLevaControls() {
        return {
            u_color: {
                value: "#00ff00",
            },
        }
    }
}