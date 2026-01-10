import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type RefObject } from "react";

interface ScrollSyncProps {
    postRef: RefObject<HTMLDivElement>
}

function ScrollSync(props: ScrollSyncProps) {
    const {postRef} = props;
    const scroll = useScroll();

    useFrame(() => {
        if (postRef.current) {
            postRef.current.style.transform = `translateY(-${scroll.offset * 100}%) translateX(-50%)`;
        }
    });

    return null;
}

export default ScrollSync;