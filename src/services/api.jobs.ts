import apiService from "@/services/api.service.ts";
import type {ConversionJobUpdate, UploadJobRequest, UploadJobResponse} from "@/types.ts";

const JOBS_ENDPOINT = '/api/projects';


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


//PUT /api/projects/{projectId}/conversion-jobs/{jobId}
export async function updateConversionJob(
    projectId: number,jobId: number,
    data: ConversionJobUpdate):Promise<UploadJobResponse>{
    const response = await apiService.put<UploadJobResponse>(
        `${JOBS_ENDPOINT}/${projectId}/conversion-jobs/${jobId}`,data);
    return response.data;

}

//DELETE /api/projects/{projectId}/conversion-jobs/{jobId}
export async function deleteConversionJob(
    projectId: number,jobId: number): Promise<void> {
    await apiService.delete(
        `${JOBS_ENDPOINT}/${projectId}/conversion-jobs/${jobId}`
    );
}

//GET /api/projects/{projectId}/conversion-jobs/{jobId}
export async function getConversionJob(
    projectId: number,jobId: number): Promise<UploadJobResponse> {
    const response = await apiService.get<UploadJobResponse>(
        `${JOBS_ENDPOINT}/${projectId}/conversion-jobs/${jobId}`
    );
    return response.data;
}