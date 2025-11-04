export interface Brand{
  id:number,
  name: string,
  logo_url:string
}

export interface Category{
  id:number,
  name:string,
  parent:string,
}