import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { type IUniform } from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class NoShader extends Shader {
    uniforms: Record<string, IUniform>;

    constructor() {
        super();
        this.uniforms = {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UpdateUniforms(__: CustomShaderMaterial, _: RootState) {
        return;
    }
}