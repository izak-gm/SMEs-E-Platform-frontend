import { Card } from "@/components/ui/card";
import StoreForm from "@/components/users/seller/store/Store";

export default function StorePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center items-center mb-6">
        <Card>
          <StoreForm />
        </Card>
      </div>
    </div>
  );
}
