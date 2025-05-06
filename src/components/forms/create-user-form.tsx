"use client";

import { createUser } from "@/actions/users/create-user";
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
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GlobeIcon,
  GlobeLockIcon,
  ImagesIcon,
  Loader2Icon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  image: z.instanceof(File).optional(),
  bio: z.string().optional(),
  private: z.boolean(),
});

export function CreateUserForm() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      image: undefined,
      bio: "",
      private: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await createUser(values);
    if (response?.error) {
      form.setError("root", { message: response.error });
    }
    router.push("/");
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    <section className="space-y-8">
      <div className="space-y-6 bg-background p-4 md:p-6 rounded-xl border">
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 ">
          <div className="relative size-12 md:size-24 rounded-full overflow-clip shrink-0">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Imagem de perfil"
                className="bg-muted object-cover"
                fill
              />
            ) : (
              <Image
                src={"/avatar-placeholder.png"}
                alt="Imagem de perfil"
                className="bg-muted object-cover"
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
          className="space-y-6 bg-background p-4 md:p-6 rounded-xl border"
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
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Publicar agora"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
