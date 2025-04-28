interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex items-center justify-center p-4 md:p-6">
      {children}
    </div>
  );
}
