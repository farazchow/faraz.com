import { Mesh, MeshLambertMaterial } from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ShaderProps } from '../utils/ShaderAbstract';
import type CustomShaderMaterial from 'three-custom-shader-material/vanilla';

function Box(props: ShaderProps) {
    const mesh = useRef<Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state) => {
        props.shader.UpdateUniforms((mesh.current.material as CustomShaderMaterial), state);
        if (!active) {
            mesh.current.position.setX(10 * Math.sin(state.clock.elapsedTime / 4));
        }
    });

    const material: CustomShaderMaterial = useMemo(() =>  {
        const baseMaterial = new MeshLambertMaterial({ 
            color: 0xff0000, 
            wireframe: props.wireframe, 
            side: props.side
        });
        return props.shader.CreateMaterial(baseMaterial);
    }, [props]);

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            material={material}
        >
            <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
        </mesh>
    );
}

export default Box