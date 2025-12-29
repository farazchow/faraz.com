import type { RootState, ThreeElements } from "@react-three/fiber";
import { type IUniform, type Material, type Side } from "three";
import CustomShaderMaterial, { type CSMPatchMap } from "three-custom-shader-material/vanilla";
import * as THREE from "three";
import type { Schema, SchemaToValues } from "leva/dist/declarations/src/types/public";

export abstract class Shader {
    vertexShader: string = `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            csm_Position = position;
        }
    `;
    fragmentShader?: string = `
        void main() { }
    `;
    abstract uniforms: Record<string, IUniform>;
    abstract cacheKey?: () => string;
    abstract UpdateUniforms(material: CustomShaderMaterial, state: RootState, options?: SchemaToValues<Schema>) : void;
    postLighting: boolean = false;
    postLightingCode: string = ``;

    constructor () { }

    CreateMaterial(baseMaterial: Material): CustomShaderMaterial {
        if (this.postLighting) {
            const patchMap: CSMPatchMap = {"*": {
                "#include <dithering_fragment>":
                    "#include <dithering_fragment>\n" + this.postLightingCode
            }};
            return new CustomShaderMaterial({
                baseMaterial: baseMaterial,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                uniforms: this.uniforms,
                patchMap: patchMap,
                cacheKey: this.cacheKey,
            });
        } else {
            return new CustomShaderMaterial({
                baseMaterial: baseMaterial,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                uniforms: this.uniforms,
                cacheKey: this.cacheKey,
            });
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getLevaControls(): SchemaToValues<Schema> {
        return {};
    }
}

export interface ShaderProps {
    shader: Shader;
    meshProps?: ThreeElements['mesh'];
    wireframe?: boolean;
    side?: Side;
    position?: THREE.Vector3;
    flatShading?: boolean;
};