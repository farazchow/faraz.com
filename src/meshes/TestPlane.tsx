import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import * as THREE from "three";
import type { ShaderProps } from "../utils/ShaderAbstract";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

const TestPlane = (props: ShaderProps) => {
    const mesh = useRef<Mesh>(null!);
    const [material, setMaterial] = useState<THREE.Material | CustomShaderMaterial>(null!);

    useEffect(() => {
        const mat = new THREE.MeshToonMaterial();
        mat.color = new THREE.Color("blue");
        mat.wireframe = props.wireframe ?? false;
        mat.side = props.side ?? THREE.DoubleSide;
        mat.opacity = 1;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMaterial(props.shader.CreateMaterial(mat));
    }, [props.shader, props.flatShading, props.wireframe, props.side]);

    // const options = useControls(props.shader.getLevaControls());

    useFrame((state) => {
        props.shader.UpdateUniforms((mesh.current.material as CustomShaderMaterial), state);
    });

    return (
        <mesh 
            ref={mesh} 
            position={props.position ?? [0, 0, 0]}  
            rotation={[-Math.PI/2, 0, -Math.PI/4]} 
            scale={1} 
            material={material}
            {...props.meshProps}
        >
            <planeGeometry args={[40, 40, 256, 256]} />
        </mesh>
    );
};

export default TestPlane;
