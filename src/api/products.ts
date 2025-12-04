import axiosInstance from './axios';
import { BACKEND_URL } from '../config/backend'; // 👈 NUEVO

export interface Producto {
  id: number;
  nombre: string;
  precio: string;
  imagen: string;
  descripcion: string;
  categoria: string;
  stock: number;
  caracteristicas?: Record<string, string>;
}

// ✅ Deja SOLO ESTA versión, con todo lo que usas
export interface SaveProductoPayload {
  nombre: string;
  precio: string;
  imagen: string; // URL relativa o completa
  descripcion: string;
  categoria: string;
  stock?: string;
  caracteristicas?: Record<string, string>;
}

// 🔹 Helper global para imágenes
export const buildImageUrl = (img: string) =>
  img.startsWith('http') ? img : `${BACKEND_URL}${img}`;

// Obtener todos los productos
export const getProductos = async (): Promise<Producto[]> => {
  const res = await axiosInstance.get<Producto[]>('/productos');
  return res.data;
};

// Obtener detalle por ID
export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await axiosInstance.get<Producto>(`/productos/${id}`);
  return res.data;
};

// Productos por categoría
export const getProductosByCategoria = async (
  categoria: string
): Promise<Producto[]> => {
  const res = await axiosInstance.get<Producto[]>(
    `/productos/categoria/${encodeURIComponent(categoria)}`
  );
  return res.data;
};

// Crear producto
export const createProducto = async (
  payload: SaveProductoPayload
): Promise<Producto> => {
  const res = await axiosInstance.post<Producto>('/productos', payload);
  return res.data;
};

// Actualizar producto
export const updateProducto = async (
  id: number,
  payload: SaveProductoPayload
): Promise<Producto> => {
  const res = await axiosInstance.put<Producto>(`/productos/${id}`, payload);
  return res.data;
};

// Subir imagen y devolver URL relativa, tipo "/uploads/productos/xxx.jpg"
export const uploadProductoImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<{ url: string }>(
    '/uploads/productos',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // Sigue devolviendo la URL relativa "/uploads/..."
  return res.data.url;
};