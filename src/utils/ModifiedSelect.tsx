/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/refs */
import {type Api} from "@react-three/postprocessing";
import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import {selectionContext, type SelectApi} from "@react-three/postprocessing"
import * as THREE from "three";

export const selectContext = /* @__PURE__ */ createContext<Api | null>(null)

export function ModifiedSelect({ enabled = false, children, ...props }: SelectApi) {
  const group = useRef<THREE.Group>(null!)
  const api = useContext(selectContext)
  useEffect(() => {
    if (api && enabled) {
      let changed = false
      const current: THREE.Object3D[] = []
      group.current.traverse((o) => {
        if (o.type === 'Mesh') {
          current.push(o)
        }
        if (api.selected.indexOf(o) === -1) changed = true
      })
      if (changed) {
        api.select((state: any) => [...state, ...current])
        return () => {
          api.select((state: any[]) => state.filter((selected: THREE.Object3D<THREE.Object3DEventMap>) => !current.includes(selected)))
        }
      }
    }
  }, [enabled, children, api]);
  return (
    <group ref={group} {...props}>
      {children}
    </group>
  )
}

export function ModifiedSelection(
  { children, enabled = true }: { enabled?: boolean; children: React.ReactNode }
) {
  const [selected, select] = useState<THREE.Object3D[]>([])
  const selectApiRef = useRef({ selected, select, enabled })
  const selectApi = selectApiRef.current

  selectApi.selected = selected
  selectApi.select = select
  selectApi.enabled = enabled

  const selectionApi = useMemo(() => ({ selected, select, enabled }), [selected, select, enabled])

  return (
    <selectContext.Provider value={selectApiRef.current}>
      <selectionContext.Provider value={selectionApi}>
        {children}
      </selectionContext.Provider>
    </selectContext.Provider>
  )
}