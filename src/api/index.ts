import { request } from "@/utils";

export const uploadImg = (data: File) =>
  request({
    url: "/upload-img",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });

export const uploadPdf = (data: File) => request({
  url: "/upload-pdf",
  method: "post",
  data,
  headers: {
    "Content-Type": "multipart/form-data",
  }
})
