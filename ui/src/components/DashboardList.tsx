import React from "react";
import { Trash2, CheckSquare, Square } from "lucide-react";
import { Course } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IconButton from "./IconButton";

interface DashboardListProps {
  courses: Course[];
  onDelete: (id: number) => void;
  onToggleSelect: (id: number) => void;
  selectedCourses: number[];
}

const DashboardList: React.FC<DashboardListProps> = ({
  courses,
  onDelete,
  onToggleSelect,
  selectedCourses,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{course.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {course.term} {course.year}
            </p>
          </CardContent>
          <CardFooter className="mt-auto">
            <IconButton
              title="Delete"
              onClick={() => onDelete(course.id)}
              icon={Trash2}
              iconColor="red-500"
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleSelect(course.id)}
              >
                {selectedCourses.includes(course.id) ? (
                  <CheckSquare className="h-5 w-5 text-blue-500" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DashboardList;