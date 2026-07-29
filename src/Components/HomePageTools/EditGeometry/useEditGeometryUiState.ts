import { useState } from "react";
import type { Geometry } from "hooks/features";

export function useEditGeometryUiState() {
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometry, setSelectedGeometry] = useState<Geometry | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingGeometry, setEditingGeometry] = useState<Geometry | null>(null);
  return {
    filterTerm,
    setFilterTerm,
    selectedGeometry,
    setSelectedGeometry,
    showConfirmModal,
    setShowConfirmModal,
    isDeleting,
    setIsDeleting,
    editingGeometry,
    setEditingGeometry,
  };
}
