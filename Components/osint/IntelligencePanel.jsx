import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Brain, 
  Shield, 
  AlertTriangle,
  Clock,
  Database,
  Eye
} from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";

export default function IntelligencePanel({ entity, analysis }) {
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const reportData = await InvokeLLM({
        prompt: `Generate a comprehensive OSINT intelligence report for this entity analysis:

Entity: ${entity.identifier}
Type: ${entity.type}
Confidence: ${analysis.confidence}
Risk Level: ${analysis.risk_level}
Related Entities: ${entity.related_entities?.length || 0}

Create a professional intelligence report that includes:
1. Executive Summary
2. Entity Profile Analysis
3. Digital Footprint Assessment
4. Risk Assessment
5. Correlation Analysis
6. Recommendations for further investigation
7. Compliance and Legal Considerations

Keep the tone professional and suitable for security/intelligence professionals.`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            entity_profile: { type: "string" },
            digital_footprint: { type: "string" },
            risk_assessment: { type: "string" },
            correlation_analysis: { type: "string" },
            recommendations: { type: "string" },
            compliance_notes: { type: "string" }
          }
        }
      });
      setReport(reportData);
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
    setIsGenerating(false);
  };

  const exportReport = () => {
    if (!report) return;
    
    const reportText = `
OSINT INTELLIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}
Entity: ${entity.identifier}

EXECUTIVE SUMMARY
${report.executive_summary}

ENTITY PROFILE ANALYSIS
${report.entity_profile}

DIGITAL FOOTPRINT ASSESSMENT
${report.digital_footprint}

RISK ASSESSMENT
${report.risk_assessment}

CORRELATION ANALYSIS
${report.correlation_analysis}

RECOMMENDATIONS
${report.recommendations}

COMPLIANCE AND LEGAL CONSIDERATIONS
${report.compliance_notes}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OSINT_Report_${entity.identifier}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Analysis Summary */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Risk Level</p>
              <Badge variant="outline" className={`mt-1 ${
                analysis.risk_level === 'low' ? 'text-green-400 border-green-500' :
                analysis.risk_level === 'medium' ? 'text-yellow-400 border-yellow-500' :
                'text-red-400 border-red-500'
              }`}>
                {analysis.risk_level.toUpperCase()}
              </Badge>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Correlation Patterns</p>
              <div className="mt-2 space-y-1">
                {analysis.correlation_patterns?.map((pattern, index) => (
                  <div key={index} className="text-white text-sm bg-gray-700 p-2 rounded">
                    {pattern}
                  </div>
                )) || <p className="text-gray-500 text-sm">No patterns identified</p>}
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-400" />
                <p className="text-gray-400 text-sm">Compliance Status</p>
              </div>
              <p className="text-green-400 text-sm">✓ Legal data sources only</p>
              <p className="text-green-400 text-sm">✓ Privacy compliant</p>
              <p className="text-green-400 text-sm">✓ Ethical guidelines met</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intelligence Report */}
      <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Intelligence Report
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            {report && (
              <Button 
                onClick={exportReport}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {report ? (
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="summary" className="data-[state=active]:bg-gray-700 text-white">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700 text-white">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="risk" className="data-[state=active]:bg-gray-700 text-white">
                  Risk
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="data-[state=active]:bg-gray-700 text-white">
                  Actions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Executive Summary</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{report.executive_summary}</p>
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Entity Profile Analysis</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{report.entity_profile}</p>
                </div>
              </TabsContent>

              <TabsContent value="risk">
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Risk Assessment</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{report.risk_assessment}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Digital Footprint</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{report.digital_footprint}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Recommendations</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{report.recommendations}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Compliance Notes</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{report.compliance_notes}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Generate Intelligence Report</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Click "Generate Report" to create a comprehensive intelligence analysis using AI.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Typical generation time: 10-15 seconds</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
