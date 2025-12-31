/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RootState } from "@react-three/fiber";
import { Shader } from "../utils/ShaderAbstract";
import { type IUniform } from "three";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import type { SchemaToValues, Schema } from "leva/dist/declarations/src/types";
// import { useControls } from "leva";

export default class ToonShader extends Shader {
    postLighting: boolean = true;
    fragmentShader: string = `
        // A dumb man's toon shader
        varying vec2 vUv;
        uniform float u_binaryThreshold;
        uniform float u_cellShadingThreshold;
        uniform vec3 u_light;
        uniform vec3 u_dark;
        uniform float u_cellShading;

        // Found on https://www.shadertoy.com/view/4dKcWK
        vec3 HUEtoRGB(in float hue)
        {
            // Hue [0..1] to RGB [0..1]
            // See http://www.chilliant.com/rgb2hsv.html
            vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
            return clamp(rgb, 0., 1.);
        }

        vec3 RGBtoHCV(in vec3 rgb)
        {
            // RGB [0..1] to Hue-Chroma-Value [0..1]
            // Based on work by Sam Hocevar and Emil Persson
            vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1., 2. / 3.) : vec4(rgb.gb, 0., -1. / 3.);
            vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
            float c = q.x - min(q.w, q.y);
            float h = abs((q.w - q.y) / (6. * c + EPSILON) + q.z);
            return vec3(h, c, q.x);
        }

        vec3 HSVtoRGB(in vec3 hsv)
        {
            // Hue-Saturation-Value [0..1] to RGB [0..1]
            vec3 rgb = HUEtoRGB(hsv.x);
            return ((rgb - 1.) * hsv.y + 1.) * hsv.z;
        }

        vec3 HSLtoRGB(in vec3 hsl)
        {
            // Hue-Saturation-Lightness [0..1] to RGB [0..1]
            vec3 rgb = HUEtoRGB(hsl.x);
            float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
            return (rgb - 0.5) * c + hsl.z;
        }

        vec3 RGBtoHSV(in vec3 rgb)
        {
            // RGB [0..1] to Hue-Saturation-Value [0..1]
            vec3 hcv = RGBtoHCV(rgb);
            float s = hcv.y / (hcv.z + EPSILON);
            return vec3(hcv.x, s, hcv.z);
        }

        vec3 RGBtoHSL(in vec3 rgb)
        {
            // RGB [0..1] to Hue-Saturation-Lightness [0..1]
            vec3 hcv = RGBtoHCV(rgb);
            float z = hcv.z - hcv.y * 0.5;
            float s = hcv.y / (1. - abs(z * 2. - 1.) + EPSILON);
            return vec3(hcv.x, s, z);
        }

        // Store pre lighting values and set to white to get color
        void main() {
            vec3 preLightRGB = csm_DiffuseColor.rgb;
            vec3 preLightHSL = RGBtoHSL(preLightRGB);
            csm_DiffuseColor.rgb = vec3(1.0);
        }
    `;
    postLightingCode: string = `
        // Store the current color for testing;
        vec3 postLightHSL = RGBtoHSL(gl_FragColor.rgb);

        // Make Duck two tone according to original color
        float lum = dot(vec3(0.2126, 0.7152, 0.0722), preLightRGB);
            if (lum > u_binaryThreshold) {
                gl_FragColor.rgb = u_light;
            } else {
                gl_FragColor.rgb = u_dark;
            }

        // Darken color if in shadows
        if (1.0 - postLightHSL.z > u_cellShadingThreshold) {
            vec3 FragHSL = RGBtoHSL(gl_FragColor.rgb) - vec3(0.0, 0.0, u_cellShading);
            gl_FragColor.rgb = HSLtoRGB(FragHSL);
        } 

    `;
    uniforms: Record<string, IUniform>;

    constructor() {
        super();
        this.uniforms = {
            u_time: {value: 0.0},
            u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            u_binaryThreshold: {value: .15},
            u_light: {value: new THREE.Color("#edd57e")},
            u_dark: {value: new THREE.Color("#00539c")},
            u_cellShadingThreshold: {value: 0.3},
            u_cellShading: {value: 0.3},
        };
    }

    UpdateUniforms(material: CustomShaderMaterial, state: RootState, options?: SchemaToValues<Schema>) {
        material.uniforms.u_time.value = state.clock.getElapsedTime();

        if (options) {
            material.uniforms.u_light.value = new THREE.Color((options.u_light as string));
            material.uniforms.u_dark.value = new THREE.Color((options.u_dark as string));
            material.uniforms.u_binaryThreshold.value = (options.u_binaryThreshold as number);
            material.uniforms.u_cellShadingThreshold.value = (options.u_cellShadingThreshold as number);
            material.uniforms.u_cellShading.value = (options.u_cellShading as number);
        }
    }

    getLevaControls() {
        return {
            u_light: {
                value: "#edd57e",
            },
            u_dark: {
                value: "#00539c",
            },
            u_binaryThreshold: {
                value: this.uniforms.u_binaryThreshold.value,
                min: 0,
                max: 1,
                step: .05,
            },
            u_cellShadingThreshold: {
                value: this.uniforms.u_cellShadingThreshold.value,
                min: -.25,
                max: 1.0,
                step: .01,
            },
            u_cellShading: {
                value: this.uniforms.u_cellShading.value,
                min: 0,
                max: 1.0,
                step: .05,
            },
        }
    }
}

// Possible color combinations
const a = {u_light: '#ffdfb9', u_dark: '#a4193d'};
const b = {u_light: '#eea47f', u_dark: '#00539c'};
const c = {u_light: '#1a7a4c', u_dark: '#101820'};
const d = {u_light: '#fcf6f5', u_dark: '#075229'};