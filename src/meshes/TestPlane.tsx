import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import * as THREE from "three";
import type { ShaderProps } from "../utils/ShaderAbstract";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { useControls } from "leva";

const TestPlane = (props: ShaderProps) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef<Mesh>(null!);
    const [material, setMaterial] = useState<THREE.Material | CustomShaderMaterial>(null!);


    useEffect(() => {
        const mat = new THREE.MeshStandardMaterial();
        mat.wireframe = props.wireframe ?? false;
        mat.flatShading = props.flatShading ?? true;
        mat.side = props.side ?? THREE.FrontSide;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMaterial(props.shader.CreateMaterial(mat));
    }, [props.shader, props.flatShading, props.wireframe, props.side]);

    const options = useControls(props.shader.getLevaControls());

    useFrame((state) => {
        props.shader.UpdateUniforms((mesh.current.material as CustomShaderMaterial), state, options);
    });

    return (
        <mesh 
            ref={mesh} 
            position={props.position ?? [0, 0, 0]}  
            rotation={[-Math.PI / 2, 0, 0]} 
            scale={1} 
            material={material}
            {...props.meshProps}
        >
            <planeGeometry args={[4, 4, 32, 32]} />
        </mesh>
    );
};

export default TestPlane;
