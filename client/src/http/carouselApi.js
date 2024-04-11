import axios from 'axios';


const $host = axios.create({
    baseURL: 'http://localhost:3000/'
  });

export const getAllImages = async () => {
    const { data } = await $host.get('api/carousel/');
    return data;
};

export const addImage = async (file) => {
    const { data } = await $host.post('api/carousel', file);
    return data;
  };

export const deleteImage = async (imageName) => {
    const { data } = await $host.delete(`api/carousel/delete/?imageName=${imageName}`);
    return data;
};
