import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";

function useInspectPosition(closeFactor: number, screenX: number) {
  const { camera } = useThree();
  
  const inspectPosition = useMemo(() => {
    const ndcX = screenX; // Left quarter of screen
    const ndcY = 0;    // Vertical center
    
    // Calculate the desired distance from camera
    const distance = 5 * closeFactor;
    
    // Create a vector in NDC space
    const ndcPosition = new Vector3(ndcX, ndcY, 0.5);
    
    // Unproject from NDC to world space
    ndcPosition.unproject(camera);
    
    // Get camera position and direction to the unprojected point
    const direction = ndcPosition.sub(camera.position).normalize();
    
    // Place object at desired distance along this direction
    const worldPosition = camera.position.clone().add(
      direction.multiplyScalar(distance)
    );
    
    return worldPosition.toArray();
  }, [camera, closeFactor, screenX]);
  
  return inspectPosition;
}

export default useInspectPosition;