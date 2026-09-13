export const slugify=(value:string)=>value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');export const formatCategorySlug=(value:string)=>slugify(value)
