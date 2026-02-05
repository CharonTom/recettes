export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
  author?: {
    _id: string;
    name: string;
  };
}

export interface JwtPayload {
  email?: string;
  id?: string;
  name?: string;
}

export interface RecipeCardProps {
  recipe: Recipe;
  handleDeleteRecipe: (id: string) => void;
}

export interface FullscreenCarouselModalProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onClose: () => void;
  alt?: string;
}

export interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CarouselProps {
  images?: string[];
  alt?: string;
}
