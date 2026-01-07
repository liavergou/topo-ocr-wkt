import apiService from "@/services/api.service.ts";
import type {ConversionJobUpdate, UploadJobRequest, UploadJobResponse} from "@/types.ts";

const JOBS_ENDPOINT = '/api/projects';

/**
 * Upload form-data to server
 * @param request - Upload form-data consisting of image file(Blob), project id and prompt id
 * @returns conversion job with OCR results and metadata
 */
//POST /api/projects/{projectId}/conversion-jobs/new
export async function uploadImage(request: UploadJobRequest): Promise<UploadJobResponse> {
    //συνθεση του FormData
    const formData = new FormData();

    const fileName = request.fileName;
    formData.append('ImageFile', request.imageFile, fileName);

    formData.append('ProjectId', String(request.projectId));
    formData.append('PromptId', String(request.promptId));

    const response = await apiService.post<UploadJobResponse>(
        `${JOBS_ENDPOINT}/${request.projectId}/conversion-jobs/new`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }

    );
    return response.data

}

/**
 * Update conversion job coordinates
 * @param projectId - project id
 * @param jobId - job id
 * @param data - Updated coordinates data
 * @returns Updated conversion job with new coordinates
 */
//PUT /api/projects/{projectId}/conversion-jobs/{jobId}
export async function updateConversionJob(
    projectId: number,jobId: number,
    data: ConversionJobUpdate):Promise<UploadJobResponse>{
    const response = await apiService.put<UploadJobResponse>(
        `${JOBS_ENDPOINT}/${projectId}/conversion-jobs/${jobId}`,data);
    return response.data;

}

/**
 * Delete conversion job (soft delete)
 * @param projectId - project id
 * @param jobId - job id
 * @returns void
 */
//DELETE /api/projects/{projectId}/conversion-jobs/{jobId}
export async function deleteConversionJob(
    projectId: number,jobId: number): Promise<void> {
    await apiService.delete(
        `${JOBS_ENDPOINT}/${projectId}/conversion-jobs/${jobId}`
    );
}

/**
 * Get conversion job details by id
 * @param projectId - project id
 * @param jobId - job id
 * @returns Conversion job with coordinates and metadata
 */
//GET /api/projects/{projectId}/conversion-jobs/{jobId}
export async function getConversionJob(
    projectId: number,jobId: number): Promise<UploadJobResponse> {
    const response = await apiService.get<UploadJobResponse>(
        `${JOBS_ENDPOINT}/${projectId}/conversion-jobs/${jobId}`
    );
    return response.data;
}