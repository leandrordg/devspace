"use client";

import { updateUser } from "@/actions/users/update-user";
import { LoadingButton } from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobeLockIcon, ImagesIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { User } from "../../../generated";

const formSchema = z.object({
  name: z.string().nonempty().optional(),
  email: z.string().email("Email inválido").nonempty().optional(),
  username: z.string().nonempty().optional(),
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

  const userInitials = (form.watch("name") || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <section className="space-y-4">
      <div className="space-y-6 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border">
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
          <Avatar className="size-12 md:size-24">
            <AvatarImage src={previewUrl ?? user.image} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-muted-foreground">{form.watch("username")}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl tracking-tight">{form.watch("name")}</h1>

              {form.watch("private") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <GlobeLockIcon className="size-4 text-cyan-600" />
                  </TooltipTrigger>
                  <TooltipContent>Perfil privado</TooltipContent>
                </Tooltip>
              )}
            </div>

            <p className="text-sm text-muted-foreground break-all line-clamp-3">
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
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    disabled={isSubmitting}
                    onCheckedChange={field.onChange}
                    className="bg-background"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Manter perfil privado</FormLabel>
                  <FormDescription>
                    Somente seguidores aceitos poderão interagir com você e ver
                    as suas publicações.
                  </FormDescription>
                  <FormDescription>
                    <strong>Aviso:</strong> ao tornar o perfil público, todas as
                    solicitações pendentes serão aceitas automaticamente.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <LoadingButton
              type="submit"
              variant="cyan"
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
