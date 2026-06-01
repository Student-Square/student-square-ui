import { baseApi } from "@/redux/api/baseApi";
import type { ApiBlogCategoryWithCount } from "@/types/blogs";
import type { Paginated } from "@/types/api";

export type AdminBlogListItem = {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  author: { id: string; fullName: string } | null;
  category: { slug: string; name: string };
};

export type AdminBlogPost = AdminBlogListItem & {
  titleBn: string | null;
  excerpt: string;
  excerptBn: string | null;
  body: string;
  bodyBn: string | null;
  displayAuthorName: string | null;
  displayAuthorTitle: string | null;
  displayAuthorImage: string | null;
  displayAuthorBio: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImage: { id: string; url: string; alt: string | null } | null;
  tags: { tag: { id: string; slug: string; name: string } }[];
};

export type MediaUploadResult = {
  id: string;
  url: string;
  alt: string | null;
};

export type CreateBlogPostInput = {
  title: string;
  excerpt: string;
  body: string;
  categorySlug: string;
  tagSlugs?: string[];
  isFeatured?: boolean;
  coverImageId?: string | null;
  displayAuthorName?: string;
  displayAuthorTitle?: string;
  displayAuthorBio?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  coverImageId?: string | null;
};

const adminBlogsApiSlice = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (build) => ({
    adminListBlogs: build.query<
      Paginated<AdminBlogListItem>,
      { page?: number; limit?: number; searchTerm?: string; status?: string; categorySlug?: string; updatedFrom?: string; updatedTo?: string; sortBy?: string; sortOrder?: "asc" | "desc" }
    >({
      query: (params = {}) => ({ url: "/admin/blogs", params }),
      providesTags: ["AdminBlogs"],
    }),

    adminGetBlog: build.query<AdminBlogPost, string>({
      query: (id) => `/admin/blogs/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminBlogs", id }],
    }),

    adminCreateBlog: build.mutation<AdminBlogPost, CreateBlogPostInput>({
      query: (body) => ({ url: "/admin/blogs", method: "POST", body }),
      invalidatesTags: ["AdminBlogs", "Blogs"],
    }),

    adminUpdateBlog: build.mutation<AdminBlogPost, { id: string; data: UpdateBlogPostInput }>({
      query: ({ id, data }) => ({ url: `/admin/blogs/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "AdminBlogs", id }, "AdminBlogs", "Blogs"],
    }),

    adminPublishBlog: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/blogs/${id}/publish`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "AdminBlogs", id }, "AdminBlogs", "Blogs"],
    }),

    adminArchiveBlog: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminBlogs", "Blogs"],
    }),

    adminCreateCategory: build.mutation<ApiBlogCategoryWithCount, { name: string; order?: number }>({
      query: (body) => ({ url: "/admin/blogs/categories", method: "POST", body }),
      invalidatesTags: ["BlogCategories"],
    }),

    adminUpdateCategory: build.mutation<ApiBlogCategoryWithCount, { id: string; data: { name?: string; order?: number; isActive?: boolean } }>({
      query: ({ id, data }) => ({ url: `/admin/blogs/categories/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["BlogCategories"],
    }),

    adminDeleteCategory: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/blogs/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["BlogCategories"],
    }),

    adminUploadMedia: build.mutation<MediaUploadResult, FormData>({
      query: (formData) => ({ url: "/admin/media", method: "POST", body: formData }),
    }),
  }),
});

export const {
  useAdminListBlogsQuery,
  useAdminGetBlogQuery,
  useAdminCreateBlogMutation,
  useAdminUpdateBlogMutation,
  useAdminPublishBlogMutation,
  useAdminArchiveBlogMutation,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
  useAdminUploadMediaMutation,
} = adminBlogsApiSlice;
