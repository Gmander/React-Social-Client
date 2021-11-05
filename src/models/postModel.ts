import { Profile } from "./profileModel";
import { Comment } from "./commentModel";

export interface PostModel {
    id: number,
    title: string,
    postText: string,
    imageURL: string,
    profile: Profile,
    comments: Comment[]
}
