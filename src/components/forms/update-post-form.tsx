"use client";

import { updatePost } from "@/actions/posts/update-post";
import { LoadingButton } from "@/components/loading-button";
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
import { Post } from "../../../generated";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
});

interface Props {
  asChild?: boolean;
  setOpen: (open: boolean) => void;
  post: Post;
}

export function UpdatePostForm({ post, asChild, setOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: post.id,
      content: post.content,
      published: post.published,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, error } = await updatePost(values);

    if (success) {
      toast.success(success);
      setOpen(false);
    }

    if (error) {
      toast.error(error);
    }
  }

  const { isSubmitting, isValid, isDirty } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-6",
          !asChild &&
            "bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border"
        )}
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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
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
            variant="cyan"
            text="Atualizar"
            loadingText="Atualizando..."
            disabled={isSubmitting || !isValid || !isDirty}
            loading={isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
