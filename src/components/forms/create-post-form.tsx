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
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagesIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  content: z.string().min(1, { message: "Campo obrigatório" }),
  image: z.instanceof(File).optional(),
  published: z.boolean(),
});

export function CreatePostForm() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      image: undefined,
      published: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, error } = await createPost(values);

    if (success) {
      toast.success(success);
      router.push("/");
      return;
    }

    if (error) {
      console.log("createPost error: ", error);
      toast.error("Ocorreu um erro", { description: error });
    }
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // in the future, we may use client-side image uploading, so we can upload larger images.
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("image", {
          type: "manual",
          message: "A imagem deve ter no máximo 1MB.",
        });

        setPreviewUrl(null);

        if (fileInputRef.current) fileInputRef.current.value = "";

        return;
      }

      form.clearErrors("image");
      form.setValue("image", file, { shouldDirty: true });

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    form.setValue("image", undefined, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { isSubmitting, isDirty } = form.formState;

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
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagesIcon /> Adicionar imagem
              </Button>

              {previewUrl && (
                <div className="relative mt-4 w-fit">
                  <Image
                    src={previewUrl}
                    alt="Pré-visualização da imagem"
                    width={1920}
                    height={512}
                    className="object-contain bg-muted/20 rounded-xl border max-h-[512px]"
                  />
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2"
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
          name="published"
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
                <FormLabel>Publicação visível para todos os usuários</FormLabel>
                <FormDescription>
                  Se não estiver marcado, a publicação será visível apenas para
                  você.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <LoadingButton
            type="submit"
            text="Adicionar publicação"
            loadingText="Adicionando..."
            disabled={isSubmitting || !isDirty}
            loading={isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
