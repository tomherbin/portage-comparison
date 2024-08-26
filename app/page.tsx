"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Company {
  "Nom de l&apos;entreprise": string;
  Création: string;
  "Site Web": string;
  GAPSE: string;
  PEPS: string;
  'Label "Zéro frais caché"': string;
  Simulateur: string;
  "Simulateur.1": string;
  "✅": string;
  TJM: string;
  "Jours travaillés": string;
  "Revenu Brut": string;
  "Charges patronales": string;
  "Charges salariales": string;
  "Frais de gestion": string;
  "Part Net du CA": string;
  "Cotisations sociales": string;
  "Revenu net": string;
  [key: string]: string;
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "select": true,
    "Nom de l&apos;entreprise": true,
    "Création": true,
    "Frais de gestion": true,
    "Part Net du CA": true,
    "Revenu net": true,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [viewMode, setViewMode] = useState<"card" | "table" | "comparison">(
    "table"
  );

  useEffect(() => {
    fetch("/data/companies.csv")
      .then((response) => response.text())
      .then((csvString) => {
        const result = Papa.parse<Company>(csvString, {
          header: true,
          skipEmptyLines: true,
        });
        setCompanies(result.data);
      });
  }, []);

  const columns: ColumnDef<Company>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "Nom de l&apos;entreprise",
        header: "Nom de l&apos;entreprise",
        cell: ({ row }) => {
          const company = row.original;
          return (
            <a
              href={company["Site Web"]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {company["Nom de l&apos;entreprise"]}
            </a>
          );
        },
      },
      {
        accessorKey: "Création",
        header: "Création",
      },
      {
        accessorKey: "Frais de gestion",
        header: "Frais de gestion",
      },
      {
        accessorKey: "Part Net du CA",
        header: "Part Net du CA",
      },
      {
        accessorKey: "Revenu net",
        header: "Revenu net",
      },
      ...Object.keys(companies[0] || {})
        .filter(key => !["Nom de l&apos;entreprise", "Création", "Site Web", "Frais de gestion", "Part Net du CA", "Revenu net"].includes(key))
        .map(key => ({
          accessorKey: key,
          header: key,
        })),
      {
        id: "actions",
        cell: ({ row }) => {
          const company = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(
                      company["Nom de l&apos;entreprise"]
                    )
                  }
                >
                  Copier le nom de l&apos;entreprise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [companies]
  );

  const table = useReactTable({
    data: companies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const CompanyCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
      {companies.map((company) => (
        <Card key={company["Nom de l&apos;entreprise"]}>
          <CardHeader>
            <CardTitle>{company["Nom de l&apos;entreprise"]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Frais: {company["Frais de gestion"]}%</p>
            <p>Création: {company["Création"]}</p>
            <p>
              Site Web:{" "}
              <a
                href={company["Site Web"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {company["Site Web"]}
              </a>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const CompanyTable = () => (
    <div className="rounded-md border p-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer les entreprises..."
          value={
            (table
              .getColumn("Nom de l&apos;entreprise")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("Nom de l&apos;entreprise")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur{" "}
          {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );

  const ComparisonView = () => (
    <div className="rounded-md border p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Attribut</TableHead>
            {companies.map((company) => (
              <TableHead key={company["Nom de l&apos;entreprise"]}>
                {company["Nom de l&apos;entreprise"]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(companies[0] || {}).map((attribute) => (
            <TableRow key={attribute}>
              <TableCell>{attribute}</TableCell>
              {companies.map((company) => (
                <TableCell key={company["Nom de l&apos;entreprise"]}>
                  {company[attribute]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <main className="py-20">
        <h1 className="text-4xl font-bold mb-2 text-primary">Portage List</h1>
        <p className="text-xl mb-8 text-muted-foreground">Comparateur des sociétés de portage salarial en France</p>
        
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() =>
              table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())
            }
          >
            {table.getIsAllPageRowsSelected()
              ? "Désélectionner"
              : "Sélectionner"}{" "}
            tout
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setColumnVisibility({
                "select": true,
                "Nom de l&apos;entreprise": true,
                "Création": true,
                "Frais de gestion": true,
                "Part Net du CA": true,
                "Revenu net": true,
              })
            }
          >
            Réinitialiser les colonnes
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Vue
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("table")}>
                Vue tableau
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("card")}>
                Vue carte
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("comparison")}>
                Vue comparaison
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {viewMode === "card" && <CompanyCards />}
        {viewMode === "table" && <CompanyTable />}
        {viewMode === "comparison" && <ComparisonView />}
      </main>
    </div>
  );
}