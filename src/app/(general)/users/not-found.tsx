import { TriangleAlert } from 'lucide-react';

export default function UserNotFound() {
  return (
    <div className="py-8 px-4 container mx-auto text-center bg-foreground">
      <TriangleAlert className="inline-block" size={40} />

      <p className="font-bold my-4">Oops!!! The user you are looking for was not found</p>
    </div>
  );
}
