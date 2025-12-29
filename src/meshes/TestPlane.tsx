import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh } from "three";
import * as THREE from "three";
import type { ShaderProps } from "../utils/ShaderAbstract";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

const TestPlane = (props: ShaderProps) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef<Mesh>(null!);

    const material: CustomShaderMaterial = useMemo(() =>  {
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xff0000, 
            wireframe: props.wireframe, 
            side: props.side
        });
        return props.shader.CreateMaterial(baseMaterial);
    }, [props]);

    useFrame((state) => {
        props.shader.UpdateUniforms((mesh.current.material as CustomShaderMaterial), state);
    });

    return (
        <mesh 
            ref={mesh} 
            position={[0, 0, 0]}  
            rotation={[-Math.PI / 2, 0, 0]} 
            scale={1.5} 
            material={material}
            {...props.meshProps}
        >
            <planeGeometry args={[2, 2, 32, 32]} />
        </mesh>
    );
};

export default TestPlane;
