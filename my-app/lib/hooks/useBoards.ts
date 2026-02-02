"use client"
import { useEffect, useState } from "react";
import { Board, Column } from "../models/models.types";


export function useBoard(initialBoard?: Board | null){
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
    const [error, setError] = useState<string | null>(null);
    const [isMoving, setIsMoving] = useState(false);

    useEffect(()=>{
        if (initialBoard) {
            setBoard(initialBoard);
            setColumns(initialBoard.columns || []);
        }
    }, [initialBoard])

    const refreshBoard = () => {
        if (initialBoard) {
            setBoard(initialBoard);
            setColumns(initialBoard.columns || []);
        }
    };

    async function moveJob(
        jobApplicationId: string,
        newColumnId: string,
        newOrder?: number
    ) {
        if (isMoving) return; // Prevent multiple simultaneous moves
        
        setIsMoving(true);
        setError(null);
        
        try {
            // Optimistically update the UI first
            const updatedColumns = columns.map(column => {
                // Remove job from current column
                const filteredJobs = column.jobApplications?.filter(job => job._id !== jobApplicationId) || [];
                
                if (column._id === newColumnId) {
                    // Find the job to move
                    const jobToMove = columns
                        .flatMap(col => col.jobApplications || [])
                        .find(job => job._id === jobApplicationId);
                    
                    if (jobToMove) {
                        // Add job to new column
                        const updatedJob = { ...jobToMove, columnId: newColumnId };
                        return {
                            ...column,
                            jobApplications: [...filteredJobs, updatedJob]
                        };
                    }
                }
                
                return {
                    ...column,
                    jobApplications: filteredJobs
                };
            });
            
            setColumns(updatedColumns);
            
            // Then call the server action
            const { updateJobApplication } = await import("../actions/job-applications");
            await updateJobApplication(jobApplicationId, {
                columnId: newColumnId,
                ...(newOrder !== undefined && { order: newOrder })
            });
            
        } catch (error) {
            console.error("Failed to move job:", error);
            setError("Failed to move job application");
            
            // Revert optimistic update on error
            if (initialBoard) {
                setColumns(initialBoard.columns || []);
            }
        } finally {
            setIsMoving(false);
        }
    }

    return{board, columns, error, moveJob, refreshBoard, isMoving}
}