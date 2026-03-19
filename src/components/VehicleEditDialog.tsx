import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { VehicleData } from '@/lib/api';

interface VehicleEditDialogProps {
  vehicle: VehicleData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: VehicleData) => void;
  isNew?: boolean;
}

const emptyVehicle: VehicleData = {
  id: '',
  name: '',
  category: 'scooter',
  pricePerDay: 0,
  riderPricePerDay: 0,
  image: '',
  description: '',
  features: [],
  specs: {
    engine: '',
    power: '',
    mileage: '',
    fuelCapacity: '',
  },
  available: true,
};

export function VehicleEditDialog({
  vehicle,
  isOpen,
  onClose,
  onSave,
  isNew = false,
}: VehicleEditDialogProps) {
  const [formData, setFormData] = useState<VehicleData>(emptyVehicle);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else if (isNew) {
      setFormData({
        ...emptyVehicle,
        id: 'vehicle_' + Date.now(),
      });
    }
  }, [vehicle, isNew, isOpen]);

  const handleChange = (field: keyof VehicleData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (field: keyof VehicleData['specs'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [field]: value },
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add New Vehicle' : 'Edit Vehicle'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Vehicle ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                required
                disabled={!isNew}
                placeholder="vehicle_001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Honda Activa 6G"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
                placeholder="scooter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Regular Price/Day (₹)</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => handleChange('pricePerDay', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riderPricePerDay">Rider Price/Day (₹) - Discounted for approved riders</Label>
            <Input
              id="riderPricePerDay"
              type="number"
              value={formData.riderPricePerDay || 0}
              onChange={(e) => handleChange('riderPricePerDay', parseInt(e.target.value) || 0)}
              placeholder="Leave 0 to use regular price"
            />
            <p className="text-xs text-gray-500">Special discounted price for approved delivery riders</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Brief description of the vehicle..."
            />
          </div>

          {/* Specs */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Specifications</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine">Engine</Label>
                <Input
                  id="engine"
                  value={formData.specs.engine}
                  onChange={(e) => handleSpecChange('engine', e.target.value)}
                  placeholder="109.51 cc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="power">Power</Label>
                <Input
                  id="power"
                  value={formData.specs.power}
                  onChange={(e) => handleSpecChange('power', e.target.value)}
                  placeholder="7.79 PS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  value={formData.specs.mileage}
                  onChange={(e) => handleSpecChange('mileage', e.target.value)}
                  placeholder="45 km/l"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelCapacity">Fuel Capacity</Label>
                <Input
                  id="fuelCapacity"
                  value={formData.specs.fuelCapacity}
                  onChange={(e) => handleSpecChange('fuelCapacity', e.target.value)}
                  placeholder="5.3 L"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Features</h4>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., LED Headlamp)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <Button type="button" onClick={handleAddFeature} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => handleChange('available', checked === true)}
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available for Rent
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isNew ? 'Create Vehicle' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
