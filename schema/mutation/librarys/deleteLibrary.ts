import { mutationWithClientMutationId } from 'graphql-relay';
import MongoLibrary from '../../mongo/MongoLibrary';

const deleteLibraryMutation = mutationWithClientMutationId({
    name: 'deleteLibrary',
    description: 'delete a library',
    inputFields: {},
    outputFields: {},
    mutateAndGetPayload: async (input) => {
        const session = await MongoLibrary.startSession();
        session.startTransaction();
        try {
        } catch (error) {
            console.log(error);
        }
        await session.commitTransaction();
        session.endSession();
        return null;
    },
});

export default deleteLibraryMutation;