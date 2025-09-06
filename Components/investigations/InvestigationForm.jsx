import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, FileText, Save } from "lucide-react";

export default function InvestigationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "active",
    target_entities: [],
    compliance_notes: "",
    tags: []
  });
  
  const [newEntity, setNewEntity] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addEntity = () => {
    if (newEntity.trim() && !formData.target_entities.includes(newEntity.trim())) {
      setFormData(prev => ({
        ...prev,
        target_entities: [...prev.target_entities, newEntity.trim()]
      }));
      setNewEntity("");
    }
  };

  const removeEntity = (entity) => {
    setFormData(prev => ({
      ...prev,
      target_entities: prev.target_entities.filter(e => e !== entity)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">New Investigation</h1>
            <p className="text-gray-400">Create a new intelligence case file</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Investigation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Investigation title"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-white">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData(prev => ({...prev, priority: value}))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="critical">Critical Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe the investigation objectives and background..."
                  className="bg-gray-800 border-gray-700 text-white h-24"
                />
              </div>

              {/* Target Entities */}
              <div className="space-y-4">
                <Label className="text-white">Target Entities</Label>
                <div className="flex gap-2">
                  <Input
                    value={newEntity}
                    onChange={(e) => setNewEntity(e.target.value)}
                    placeholder="Enter email, username, domain, IP, etc."
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEntity())}
                  />
                  <Button 
                    type="button" 
                    onClick={addEntity}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.target_entities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.target_entities.map((entity) => (
                      <Badge 
                        key={entity} 
                        variant="secondary" 
                        className="bg-gray-800 text-white flex items-center gap-1"
                      >
                        {entity}
                        <button 
                          type="button" 
                          onClick={() => removeEntity(entity)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <Label className="text-white">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tags for organization..."
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="border-purple-500 text-purple-400 flex items-center gap-1"
                      >
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Compliance Notes */}
              <div className="space-y-2">
                <Label htmlFor="compliance" className="text-white">Legal & Compliance Notes</Label>
                <Textarea
                  id="compliance"
                  value={formData.compliance_notes}
                  onChange={(e) => setFormData(prev => ({...prev, compliance_notes: e.target.value}))}
                  placeholder="Document legal authorization, scope limitations, data handling requirements..."
                  className="bg-gray-800 border-gray-700 text-white h-20"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onCancel}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Investigation
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
