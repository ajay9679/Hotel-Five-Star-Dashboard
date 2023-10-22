import supabase, { supabaseUrl } from "./supabase";


export async function getCabins(){
    const {data,error} = await supabase.from('cabins').select('*');
    if(error){
        console.error(error.message);
        throw new Error(`Cabins could not be loaded.`);
    }
    return data;
}

export async function createEditCabin(newCabin,id){
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll('/',"");
    const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
    //1 CREATE CABIN
    let query = supabase.from('cabins')
    if(!id)
        query = query.insert([{...newCabin,image:imagePath}]);
    if(id)
        query = query.update({...newCabin,image:imagePath}).eq('id',id);
    const {data,error} = await query.select().single();
    if(error){
        console.error(error.message);
        throw new Error(`Cabins could not be created.`);
    }
    //2 UPLOAD IMAGE
    // https://gugchapzvafcrriachkd.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
    if(hasImagePath) return data;
    const {error:storageError} = await supabase.storage.from('cabin-images').upload(imageName,newCabin.image);
    //3 DELETE THE CABIN IF THERE WAS AND ERROR UPLOADING IMAGE
    if(storageError){
        await supabase.from('cabins').delete().eq('id',data.id);
        console.error(storageError.message);
        throw new Error(`Cabins could not be created.`);
    }

    return data;
}



export async function deleteCabins(id){
    const { error,data } = await supabase.from('cabins').delete().eq('id',id);
    if(error){
        console.error(error.message);
        throw new Error('Cabins could not be deleted.');
    }
    return data;
}
