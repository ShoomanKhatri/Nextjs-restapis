import connect from "@/lib/db"
import User from "@/lib/models/user";
import { NextResponse } from "next/server"
import {Types} from "mongoose";
import Category from "@/lib/models/category";

export const GET = async(request:Request) =>{
    try {
        const {searchParams}=new URL(request.url);
        const userId =  searchParams.get("userId");

        if(!userId || Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message:"Invalid or missing userId" }),
                {
                    status:400,
                }
            );

            await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(
                JSON.stringify({ message:"User not found in database" }),
                {
                    status:400,
                }
            )
        };
        }
    const categories = await Category.findById({
        user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories),{
        status:200,
    });

    } catch (error:any) {
        return new NextResponse("Error in fetching categories"+ error.message,{
            status:500,
        });
    }
}

export const POST = async(request:Request)=>{
    try {
        const {searchParams}=new URL(request.url);
        const userId =  searchParams.get("userId");
        const {title} = await request.json();

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing userId"}),
                {status:400}
            );
        }

        await connect();

       
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message:"user not found"}), {status:404});
        }
        const newCategory = new Category({
            title,
            user : new Types.ObjectId(userId),
        });

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({
                message:"Category is created", category: newCategory
            }),
        );

    } catch (error:any) {
        return new NextResponse("Error in fetching categories"+ error.message,{
            status:500,
        });
    }
}