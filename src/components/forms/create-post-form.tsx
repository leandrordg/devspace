"use client";

import { createPost } from "@/actions/posts/create-post";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagesIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    content: z.string().trim().optional(),
    image: z.instanceof(File).optional(),
    private: z.boolean(),
  })
  .refine(
    (data) => {
      const hasContent = (data.content?.length ?? 0) > 0;
      const hasImage = !!data.image;
      return hasContent || hasImage;
    },
    {
      message: "A publicação precisa ter pelo menos conteúdo ou imagem.",
      path: ["content", "image"],
    }
  );

export function CreatePostForm() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      image: undefined,
      private: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, error } = await createPost(values);

    if (success) {
      toast.success(success);
      router.back();
    }

    if (error) toast.error(error);
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // in the future, we may use client-side image uploading, so we can upload larger images.
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("image", { message: "A imagem deve ter no máximo 1MB." });

        setPreviewUrl(null);

        if (fileInputRef.current) fileInputRef.current.value = "";

        return;
      }

      form.clearErrors("image");
      form.setValue("image", file, { shouldDirty: true, shouldValidate: true });

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    form.setValue("image", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { isSubmitting, isValid, isDirty } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo da publicação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite aqui o que você está pensando..."
                  disabled={isSubmitting}
                  className="max-h-64"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleChangeImage}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </FormControl>

              <Button
                type="button"
                disabled={isSubmitting}
                className={cn(previewUrl && "hidden")}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagesIcon /> Adicionar imagem
              </Button>

              {previewUrl && (
                <div className="relative w-fit">
                  <div className="relative flex justify-center dark:bg-muted/30 rounded-xl overflow-clip max-h-152 min-h-[300px]">
                    <Image
                      src={previewUrl}
                      alt="background"
                      aria-hidden="true"
                      className="blur-2xl"
                      fill
                    />
                    <Image
                      src={previewUrl}
                      alt="Imagem do post"
                      width={1920}
                      height={1920}
                      sizes="(max-width: 768px) 100vw, 700px"
                      className="aspect-auto object-contain z-10"
                      priority
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 z-20"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="private"
          render={({ field }) => (
            <FormItem className="flex items-start gap-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  disabled={isSubmitting}
                  onCheckedChange={field.onChange}
                  className="bg-background"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publicação privada</FormLabel>
                <FormDescription>
                  Se ativado, apenas você poderá ver essa publicação.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <LoadingButton
            type="submit"
            variant="cyan"
            text="Adicionar publicação"
            loadingText="Adicionando..."
            disabled={isSubmitting || !isValid || !isDirty}
            loading={isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
