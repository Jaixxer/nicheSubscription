import {IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ExportAsCsvQuery } from "../../queries/admin/export-as-csv.query";
import { UserRepository } from "../../repositories/user.repository";
import { Logger } from "@nestjs/common";
import * as fs from 'fs' ;
import * as path from 'path';
import { CsvParser } from 'json2csv';
@QueryHandler(ExportAsCsvQuery)
export class ExportAsCsvHandler implements IQueryHandler<ExportAsCsvQuery> {
    private readonly logger = new Logger(ExportAsCsvHandler.name);
    
    constructor(private readonly userRepository: UserRepository) {}

    async execute(query: ExportAsCsvQuery): Promise<any[]> {
        this.logger.log('Exporting users as CSV');
        try {
            // Fetch all users
            const users = await this.userRepository.searchUsers({
                offset: 0,
                limit: 10000, // Adjust as needed
                sortBy: 'createdAt',
                sortOrder: 'asc'
            });

            if (users.length === 0) {
                this.logger.warn('No users found to export');
                return [];
            }

            // Convert users to CSV format
            const csvParser = new CsvParser();
            const csvData = csvParser.parse(users);

            // Define the file path
            const filePath = path.join(__dirname, `exported_users_${query.timestamp.toISOString()}.csv`);

            // Write CSV data to file
            fs.writeFileSync(filePath, csvData);
            this.logger.log(`CSV file created at ${filePath}`);

            return users;
        } catch (error) {
            this.logger.error('Error exporting users as CSV', error);
            throw error;
        }
    }}