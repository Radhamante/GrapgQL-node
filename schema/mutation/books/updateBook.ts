import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import bookGenre from '../../enum/bookGenre';
import MongoBook from '../../mongo/MongoBook';
import MongoLibrary from '../../mongo/MongoLibrary';
import Book from '../../types/Book';
import GraphQLDate from '../../scalars/date';

const updateBookMutation = mutationWithClientMutationId({
    name: 'updateBook',
    description: 'update a book',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
            description: "Book's ID",
        },
        isbn: { type: GraphQLString, description: "Book's isbn" },
        title: { type: GraphQLString, description: "Book's title" },
        author: { type: GraphQLString, description: "Book's author" },
        date: { type: GraphQLDate, description: "Book's date" },
        idLibrary: { type: GraphQLString, description: "Book's library" },
        imageUrl: { type: GraphQLString, description: "Book's imageUrl" },
        genre: {
            type: new GraphQLList(new GraphQLList(bookGenre))!,
            description: "Book's genre",
        },
    },
    outputFields: {
        book: { type: Book, description: 'Modified book' },
    },
    mutateAndGetPayload: async (input, context: any) => {
        if (!context.logged) {
            throw Error('User not logged');
        }
        if (!context.user.isAdmin) {
            return null;
        }
        const session = await MongoBook.startSession();
        session.startTransaction();
        try {
            let library;
            if (input.idLibrary) {
                library = await MongoLibrary.findById(
                    input.idLibrary,
                    'address'
                );
                console.log('--------- library --------');
                console.log(library);
            }
            const updatedBook = await MongoBook.findByIdAndUpdate(input.id, {
                $set: { ...input, library },
            }).exec();
            console.log('-------- createdBook --------');
            console.log(updatedBook);

            return { book: updatedBook };
        } catch (error) {
            console.log(error);
        }
        await session.commitTransaction();
        session.endSession();
        return null;
    },
});

export default updateBookMutation;
