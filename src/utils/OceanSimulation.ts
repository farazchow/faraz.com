import * as THREE from "three";

export const oceanVertexGLSL: string = /*gsl*/`
    uniform float u_time;
    uniform int u_waveCount;
    uniform float u_steepness;
    uniform struct GerstnerWave {
        vec2 direction;
        float amplitude;
        float waveLength;
        float speed;
    } u_gerstnerWaves[4];

    varying vec2 vUv;
    varying float vHeightDelta;

    vec3 gerstner_summation(vec2 pos, float time) {
        vec3 wave_position = vec3(pos.x, pos.y, 0);
        for (int i = 0; i < u_waveCount; i++) {

            // Equation 13 in https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
            float freq = sqrt(9.8 * (2.0 * PI / u_gerstnerWaves[i].waveLength));
            float phase_i = u_gerstnerWaves[i].speed * 2.0 / u_gerstnerWaves[i].waveLength;

            // Equation 9.5 in https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
            float qi = u_steepness / (freq * u_gerstnerWaves[i].amplitude * float(u_waveCount));

            
            float qa = u_gerstnerWaves[i].amplitude * qi;
            float projection = dot(freq * u_gerstnerWaves[i].direction, vec2(pos.x, pos.y));
            float theta = projection + phase_i * time;
            
            wave_position.x += qa * u_gerstnerWaves[i].direction.x * cos(theta);
            wave_position.y += qa * u_gerstnerWaves[i].direction.y * cos(theta);
            wave_position.z += u_gerstnerWaves[i].amplitude * sin(theta);
        }
        return wave_position;
    }

    vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
    }

    vec3 recalcNormals(vec3 newPos) {
        float offset = 0.001;
        vec3 tangent = orthogonal(normal);
        vec3 bitangent = normalize(cross(normal, tangent));
        vec3 neighbour1 = position + tangent * offset;
        vec3 neighbour2 = position + bitangent * offset;

        vec3 displacedNeighbour1 = gerstner_summation(neighbour1.xy, u_time);
        vec3 displacedNeighbour2 = gerstner_summation(neighbour2.xy, u_time);

        vec3 displacedTangent = displacedNeighbour1 - newPos;
        vec3 displacedBitangent = displacedNeighbour2 - newPos;

        return normalize(cross(displacedTangent, displacedBitangent));
    }

    void main() {
        vUv = uv;
        vec3 p = position;        
        // csm_Position = gerstner_wave(p.xy, u_time, csm_Normal);
        // csm_Position = position;
        csm_Position = gerstner_summation(p.xy, u_time);
        csm_Normal = recalcNormals(csm_Position);
        vHeightDelta = csm_Position.z;
    }   
`;

export class Ocean {
    // Parameters
    waveCount = 4;
    rotation = 0;
    steepness = .8;
    speed = 1;

    // median
    amplitude = .5;
    waveLength = 5;

    // State
    gerstnerWaves: GerstnerWave[];

    constructor(steepness = .3,) {
        // this.rotation = rotation;
        this.steepness = steepness;
        this.gerstnerWaves = [];
        this.GenerateWaves();
    }

    GenerateWaves() {
        // Primary wave - dominant direction
        const waveA: GerstnerWave = {
            direction: new THREE.Vector2(1, 0).normalize(),
            waveLength: 8,
            speed: 3,
            amplitude: 0.1,
        };

        // Secondary wave - slight angle
        const waveB: GerstnerWave = {
            direction: new THREE.Vector2(0.8, 0.6).normalize(),
            waveLength: 5,
            speed: 2,
            amplitude: 0.075,
        };
        
        // Tertiary wave - cross wave
        const waveC: GerstnerWave = {
            direction: new THREE.Vector2(-0.3, 0.9).normalize(),
            waveLength: 3,
            speed: 2,
            amplitude: 0.025,
        };
        
        // Detail wave - small choppy waves
        const waveD: GerstnerWave = {
            direction: new THREE.Vector2(0.5, -0.8).normalize(),
            waveLength: 1.5,
            speed: 1,
            amplitude: 0.01,
        };

        this.gerstnerWaves.push(waveA, waveB, waveC, waveD);
    }
}

export type GerstnerWave = {
    direction: THREE.Vector2;
    waveLength: number;
    speed: number;
    amplitude: number;
}