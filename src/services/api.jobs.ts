import apiService from "@/services/api.service.ts";
import type {UploadJobRequest, UploadJobResponse} from "@/types.ts";

const JOBS_ENDPOINT = '/api/conversion-jobs';


//POST /api/conversion-jobs
export async function uploadImage(request: UploadJobRequest): Promise<UploadJobResponse> {
    //συνθεση του FormData
    const formData = new FormData();

    const fileName = request.fileName;
    formData.append('ImageFile', request.imageFile, fileName);

    formData.append('ProjectId', String(request.projectId));
    formData.append('PromptId', String(request.promptId));

    //POST /api/conversion-jobs
    const response = await apiService.post<UploadJobResponse>(
        JOBS_ENDPOINT,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }

    );
    return response.data

}