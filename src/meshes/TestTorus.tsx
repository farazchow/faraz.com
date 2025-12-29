import { Mesh, MeshStandardMaterial} from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ShaderProps } from '../utils/ShaderAbstract';
import type CustomShaderMaterial from 'three-custom-shader-material/vanilla';

function TestTorus(props: ShaderProps) {
    const mesh = useRef<Mesh>(null!);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => {
        props.shader.UpdateUniforms((mesh.current.material as CustomShaderMaterial), state);
        if (!active) {
            mesh.current.position.setX(2 * Math.sin(state.clock.elapsedTime / 4));
            mesh.current.rotateY(delta);
        }
    });

    const material: CustomShaderMaterial = useMemo(() =>  {
        const baseMaterial = new MeshStandardMaterial({ 
            color: 0x00ff00,
            wireframe: props.wireframe, 
            side: props.side,
        });
        return props.shader.CreateMaterial(baseMaterial);
    }, [props]);

    return (
        <mesh
            {...props}
            ref={mesh}
            onClick={() => setActive(!active)}
            material={material}
        >
            <torusKnotGeometry args={[1, .4, 64, 8, 2, 3]} />
        </mesh>
    );
}

export default TestTorus;