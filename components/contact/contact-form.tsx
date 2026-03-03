"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Mail, MessageCircle, Rocket } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactPayload } from "@/lib/validations/contact";

const defaultValues: ContactPayload = {
  name: "",
  email: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: "onBlur",
  });

  async function onSubmit(values: ContactPayload) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Something went wrong. Please try again.");
      }

      toast.success("Message sent. Talk soon!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send message right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr,1fr]">
      <div className="space-y-10">
        <SectionHeader
          eyebrow="Contact"
          title="Let us explore what we can build together"
          description="Share a challenge, a product idea, or a dataset that needs a story. I usually reply within two business days."
        />
        <div className="space-y-6 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
          <ContactDetail
            icon={Mail}
            title="Email"
            description="hello@dhossain.com"
            href="mailto:hello@dhossain.com"
          />
          <ContactDetail
            icon={Building2}
            title="Base"
            description="Vilnius, Lithuania (open to remote collaborations)"
          />
          <ContactDetail
            icon={Rocket}
            title="Ideal projects"
            description="Full-stack web platforms, admin dashboards, and Android apps. I’m also open to AI/ML experiments as I continue learning."
          />
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-border/80 bg-card/90 p-6 shadow-soft"
        noValidate
      >
        <FormField
          label="Name"
          required
          error={form.formState.errors.name?.message}
        >
          <Input
            placeholder="How should I address you?"
            {...form.register("name")}
            autoComplete="name"
          />
        </FormField>
        <FormField
          label="Email"
          required
          error={form.formState.errors.email?.message}
        >
          <Input
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
            autoComplete="email"
          />
        </FormField>
        <FormField
          label="Your message"
          required
          error={form.formState.errors.message?.message}
        >
          <Textarea
            placeholder="Tell me about your idea, timeline, and the impact you are chasing."
            rows={6}
            {...form.register("message")}
          />
        </FormField>

        <div className="hidden">
          <Label htmlFor="website">Leave this empty</Label>
          <Input id="website" tabIndex={-1} autoComplete="off" {...form.register("website")} />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full rounded-3xl"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label data-required={required}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

type ContactDetailProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
};

function ContactDetail({ icon: Icon, title, description, href }: ContactDetailProps) {
  const content = (
    <>
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </>
  );

  return href ? (
    <a
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-transparent px-3 py-3 text-left transition-colors hover:border-primary/60 hover:text-primary"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-4 rounded-2xl bg-foreground/5 px-3 py-3">
      {content}
    </div>
  );
}
