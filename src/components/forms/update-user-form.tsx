"use client";

import { updateUser } from "@/actions/users/update-user";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobeIcon, GlobeLockIcon, ImagesIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { User } from "../../../generated";

const formSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("Email inválido").min(1).optional(),
  username: z.string().min(1).optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  bio: z.string().optional(),
  private: z.boolean(),
});

interface Props {
  user: User;
}

export function UpdateUserForm({ user }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      bio: user.bio ?? "",
      private: user.private,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, error } = await updateUser(values);

    if (success) {
      setPreviewUrl(null);
      toast.success(success);
    }

    if (error) {
      console.log(error);
      form.setError("root", { message: error });
      toast.error(error);
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
    form.resetField("image");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { isSubmitting, isDirty } = form.formState;

  return (
    <section className="space-y-8">
      <div className="space-y-6 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border">
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 ">
          <div className="relative size-12 md:size-24 shrink-0">
            {previewUrl || user.image ? (
              <Image
                src={previewUrl ?? user.image}
                alt="Imagem de perfil"
                className="bg-muted object-cover rounded-full overflow-clip"
                fill
              />
            ) : (
              <Image
                src="/avatar-placeholder.png"
                alt="Imagem de perfil"
                className="bg-muted object-cover rounded-full overflow-clip"
                fill
              />
            )}
          </div>

          <div>
            <p className="text-muted-foreground">{form.watch("username")}</p>

            <h1 className="text-2xl tracking-tight">{form.watch("name")}</h1>

            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Entrou em: {formatDate(new Date())}
              </p>

              {form.watch("private") ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <GlobeLockIcon className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Perfil privado</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <GlobeIcon className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Perfil público</TooltipContent>
                </Tooltip>
              )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground break-all line-clamp-3">
              {form.watch("bio") ?? "Esse usuário não possui uma biografia."}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu nome completo"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu email"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome de usuário"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      className="object-contain rounded-xl bg-background border max-h-[512px]"
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
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografia</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Conte um pouco sobre você"
                    disabled={isSubmitting}
                    className="max-h-96"
                    {...field}
                  />
                </FormControl>
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
                  <FormLabel>Mantenha meu perfil privado</FormLabel>
                  <FormDescription>
                    Somente seguidores aceitos poderão interagir com você e ver
                    as suas publicações.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <LoadingButton
              type="submit"
              text="Atualizar perfil"
              loadingText="Atualizando..."
              disabled={isSubmitting || !isDirty}
              loading={isSubmitting}
            />
          </div>
        </form>
      </Form>
    </section>
  );
}
