import axiosInstance from "./axiosConfig";

/**
 * Types importables desde '@/app/types/ambiental.types'
 * - getInstitucionPrincipal → InstitucionPrincipalResponse
 * - getContenido           → ContenidoResponse
 * - getRecursos            → RecursosResponse
 * - getGacetaEventos       → GacetaEventosResponse
 * - getAllData              → AllDataType
 */

const ID = process.env.NEXT_PUBLIC_ID_INSTITUCION;

// ============================================================
// ENDPOINT 1: Información principal de la institución
// GET /institucionesPrincipal/:id
// Retorna: descripción, misión, visión, objetivos, colores, redes
// ============================================================
export const getInstitucionPrincipal = async (signal) => {
  const response = await axiosInstance.get(`institucionesPrincipal/${ID}`,{ signal });
  if (!response.data) {
    throw new Error("No se pudo obtener la información principal de la institución");
  }
  return response.data;
};

// ============================================================
// ENDPOINT 2: Contenido de la institución
// GET /institucion/:id/contenido
// Retorna: autoridad, portada, ubicación, videos
// ============================================================
export const getContenido = async (signal) => {
  const response = await axiosInstance.get(`institucion/${ID}/contenido`, { signal });
  if (!response.data) {
    throw new Error("No se pudo obtener el contenido de la institución");
  }
  return response.data;
};

// ============================================================
// ENDPOINT 3: Recursos de la institución
// GET /institucion/:id/recursos
// Retorna: publicaciones, links externos, links internos
// ============================================================
export const getRecursos = async (signal) => {
  const response = await axiosInstance.get(`institucion/${ID}/recursos`, { signal });
  if (!response.data) {
    throw new Error("No se pudo obtener los recursos de la institución");
  }
  return response.data;
};

// ============================================================
// ENDPOINT 4: Gaceta y eventos
// GET /institucion/:id/gacetaEventos
// Retorna: gaceta, eventos, cursos, convocatorias, servicios, ofertas
// ============================================================
export const getGacetaEventos = async (signal) => {
  const response = await axiosInstance.get(`institucion/${ID}/gacetaEventos`, { signal });
  if (!response.data) {
    throw new Error("No se pudo obtener la gaceta y eventos de la institución");
  }
  return response.data;
};

// ============================================================
// CARGA COMPLETA: todos los endpoints en paralelo
// Útil para el HomeView donde se necesitan todos los datos
// ============================================================
export const getAllData = async (signal) => {
  const [principal, contenido, recursos, gacetaEventos] = await Promise.all([
    getInstitucionPrincipal(signal),
    getContenido(signal),
    getRecursos(signal),
    getGacetaEventos(signal),
  ]);
  if (!principal || !contenido || !recursos || !gacetaEventos) {
    throw new Error("No se pudo obtener toda la información de la institución");
  }
  return { principal, contenido, recursos, gacetaEventos };
};