import {NcClassification} from "@/entities/Entities";
import {PagedResultDto} from "@/PagedResultDto";

export async function getNcClassificationsList(): Promise<PagedResultDto<NcClassification>> {
   let url = `http://localhost:3000/api/nc-classifications`;
   return await fetch(url)
       .then(res =>  res.json() as unknown as PagedResultDto<NcClassification>);
}