import { baseApi } from "@/redux/api/baseApi";
import type {
  ApiBlogListItem,
  ApiBlogPost,
  ApiBlogCategoryWithCount,
  ApiBlogTagWithCount,
} from "@/types/blogs";
import type { Paginated } from "@/types/api";

type BlogListQuery = {
  searchTerm?: string;
  categorySlug?: string;
  categorySlugs?: string;
  tagSlug?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const blogsApiSlice = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (build) => ({
    getBlogs: build.query<Paginated<ApiBlogListItem>, BlogListQuery>({
      query: (params = {}) => ({ url: "/blogs", params }),
      providesTags: ["Blogs"],
    }),

    getBlogById: build.query<ApiBlogPost, string>({
      query: (id) => `/blogs/id/${encodeURIComponent(id)}`,
      providesTags: (_result, _err, id) => [{ type: "Blogs", id }],
    }),

    getBlogBySlug: build.query<ApiBlogPost, string>({
      query: (slug) => `/blogs/${encodeURIComponent(slug)}`,
      providesTags: (_result, _err, slug) => [{ type: "Blogs", id: slug }],
    }),

    getBlogCategories: build.query<ApiBlogCategoryWithCount[], void>({
      query: () => "/blogs/categories",
      providesTags: ["BlogCategories"],
    }),

    getBlogTags: build.query<ApiBlogTagWithCount[], void>({
      query: () => "/blogs/tags",
      providesTags: ["BlogTags"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
} = blogsApiSlice;

export { blogsApiSlice };
